import { createClient } from './db';

async function main() {
  const db = await createClient();

  const user = await db.user.create({ data: { email: 'u1@test.com' }});

  console.log('Create a Post');
  console.log(
    await db.post.create({
      data: { name: 'Post1', content: 'First post', ownerId: user.id }
    })
  );

  console.log('Create a Video');
  console.log(
    await db.video.create({
      data: { name: 'Video1', url: 'http://my/video/1', ownerId: user.id }
    })
  );

  console.log('Fetch User with contents');
  console.log(
    await db.user.findFirstOrThrow({ include: { contents: true } })
  );

  console.log('Fetch with base Content model');
  const content1 = await db.content.findFirstOrThrow();
  // the return type is a discriminated union
  if (content1.type === 'Post') {
    console.log('Got post:', content1.name, content1.content);
  } else if (content1.type === 'Video') {
    console.log('Got video:', content1.name, content1.url);
  }

  console.log('Delete Videos');
  await db.video.deleteMany();
  console.log('Remaining Content entities:');
  // deletion of concrete entities cascades to the base
  console.log(
    await db.content.findMany()
  );
}

main();
