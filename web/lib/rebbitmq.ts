import amqp, { Channel, ChannelModel } from 'amqplib'


 class RebbitMQ{
    private static instance:RebbitMQ
    private  connection:ChannelModel | null=null
    private  channel:Channel | null=null
    private constructor(){}

    static async getInstance(){
        if(!RebbitMQ.instance){
            const mq=new RebbitMQ()
            await mq.connect()
            this.instance=mq
        }
        return this.instance
    }
    
    private async connect(){
        if(this.connection && this.channel) return
       
        this.connection=await amqp.connect(process.env.REBBITMQ_URL!) 
    
        this.channel =await this.connection.createChannel()

        this.connection?.on('close',()=>{
            console.log("RebbitMQ connection closed. Reconnectoin...");
            this.connection=null
            this.channel=null
            
        })

        this.connection?.on('error',(err)=>{
            console.error("RebbitMQ error:",err)
        })

    }

    async sendToQueue(queue:string,message:unknown,exchange:string){
        const routingKey='review'
        if(!this.channel){
            await this.connect()
        }
        await this.channel?.assertExchange(exchange,'direct',{
            durable:true
        })
        await this.channel?.assertQueue(queue)
        await this.channel?.bindQueue(queue,exchange,routingKey)
        this.channel?.publish(exchange,routingKey,Buffer.from(JSON.stringify(message)),{persistent:true})

    }
    async getChannel() {
    if (!this.channel) {
      await this.connect();
    }

    return this.channel!;
    
}
}

export default RebbitMQ