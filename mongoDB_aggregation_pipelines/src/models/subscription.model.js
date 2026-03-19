import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema({
    subscriber: {
        type: Schema.Types.ObjectId,    // one who is subcribing
        ref: "User",
    },
    channel: {
        type: Schema.Types.ObjectId,    // one to whom 'subscriber' is subscribing
        ref: "User",
    },
}, {timestamps: true});

export const Subscription = mongoose.model("Subscription", subscriptionSchema);

/*
   every time someone subscribes:
   one document created:
   {
       subscriber: "userId_of_fan",
       channel:    "userId_of_creator"
   }

   to count subscribers of a channel:
   count documents where channel = channelId

   to count subscriptions of a user:
   count documents where subscriber = userId
*/
