export default {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    url: `redis://${process.env.REDIS_USERNAME}:password@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
};
