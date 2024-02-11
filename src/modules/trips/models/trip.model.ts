import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';


export type TripDocument = Trip & Document;

@Schema({
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
    versionKey: false,
})
export class Trip {
    @Prop({
        default: new Types.ObjectId(),
        auto: true
    })
    _id: Types.ObjectId;

    @Prop({
        type: Types.ObjectId,
        required: true
    })
    riderId: Types.ObjectId;

    @Prop({
        type: Types.ObjectId,
    })
    driverId: Types.ObjectId;

    @Prop({
        type: Number,
        default: 0
    })
    price: number;

    @Prop({
        type: String,
        enum: ['start', 'final'],
        default: 'start'
    })
    status: string;
    

    @Prop({
        type: {
            latitude: { type: Number, required: true },
            longitude: { type: Number, required: true },
        },
        _id: false,
        required: true,
    })
    startPosition: {
        latitude: number;
        longitude: number;
    };

    @Prop({
        type: {
            latitude: { type: Number, required: true },
            longitude: { type: Number, required: true },
        },
        _id: false,
        required: true,
    })
    finalPosition: {
        latitude: number;
        longitude: number;
    };

    @Prop({ default: null })
    transactionId: string;

    @Prop({
        default: null,
        type: Date,
      })
      finished_at: Date;

};

export const TripSchema = SchemaFactory.createForClass(Trip);


