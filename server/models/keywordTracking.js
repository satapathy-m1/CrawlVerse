import mongoose from "mongoose";

const rankHistorySchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now
    }, 
    position: {
        type: Number,
        default: null
    },
    page: {
        type: Number,
        default: null
    }, 
    title: {
        type: String,
        trim: true,
        default: ""
    },
    snippet: {
        type: String,
        trim: true,
        default: ""
    }
}, {_id: false});

const competitorSchema = new mongoose.Schema({
    position: {
        type: Number,
        default: null
    },
    url: {
        type: String,
        trim: true,
        default: ""
    },
    domain: {
        type: String,
        trim: true,
        default: ""
    },
    title: {
        type: String,
        trim: true,
        default: ""
    },
    snippet: {
        type: String,
        trim: true,
        default: ""
    }
}, {_id: false});

const keywordTrackingSchema = new mongoose.Schema({
    userId :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    keyword: {
        type: String,
        required: true,
        trim:true,
        lowercase: true
    },
    url: {
        type: String,
        trim: true,
        required: true
    },
    domain: {
        type: String,
        required: true
    },
    currentPosition: {
        type: Number,
        default: null
    },
    bestPosition: {
        type: Number,
        default: null
    },
    positionChange: {
        type: Number,
        default: 0
    },
    currentPage: {
        type: Number,
        default: null
    },
    rankingHistory: [rankHistorySchema],
    competitors: [competitorSchema],
    active: {
        type: Boolean,
        default: true
    },
    status: {
        type: String,
        enum: ['pending', 'checking', 'active', 'error'],
        default: 'pending'
    },
    lastChecked: {
        type: Date,
        default: null
    }
}, { timestamps: true });

keywordTrackingSchema.index({ userId: 1, keyword: 1, url: 1 }, { unique: true });

const KeywordTracking = mongoose.model('KeywordTracking', keywordTrackingSchema);

export default KeywordTracking;