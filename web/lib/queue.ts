import {Queue} from "bullmq"
import {Redis} from 'ioredis';

const connection = new Redis();

export const review_queue= new Queue('code-review',{connection})
