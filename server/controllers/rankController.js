import KeywordTracking from "../models/keywordTracking.js";
import { keywordTracking } from "../services/keywordTrackingService.js";

// Add a keyword to track
export const addKeyword = async (req, res) => {
    try {
        const { keyword, url } = req.body;

        if (!keyword || !url) {
            return res.status(400).json({
                success: false,
                message: "Keyword and URL are required"
            });
        }

        const trimmedKeyword = keyword.trim();

        if (!trimmedKeyword || trimmedKeyword.length > 100) {
            return res.status(400).json({
                success: false,
                message: "Keyword must be between 1 and 100 characters"
            });
        }

        let domain, normalizedUrl;

        try {
            const parsedUrl = new URL(
                url.startsWith("http")
                    ? url
                    : `http://${url}`
            );

            parsedUrl.hostname =
                parsedUrl.hostname.toLowerCase();

            normalizedUrl = parsedUrl.toString();

            domain = parsedUrl.hostname;

        } catch {
            return res.status(400).json({
                success: false,
                message: "Invalid URL format"
            });
        }

        const existingTracking =
            await KeywordTracking.findOne({
                userId: req.user._id,
                keyword: trimmedKeyword.toLowerCase(),
                domain
            });

        if (existingTracking && existingTracking.active) {
            return res.status(400).json({
                success: false,
                message:
                    "You are already tracking this keyword for the specified URL"
            });
        }

        if (existingTracking && !existingTracking.active) {

            existingTracking.active = true;

            await existingTracking.save();

            return res.status(200).json({
                success: true,
                message: "Keyword tracking reactivated",
                tracking: existingTracking
            });
        }

        const newTracking =
            await KeywordTracking.create({
                userId: req.user._id,
                keyword: trimmedKeyword.toLowerCase(),
                url: normalizedUrl,
                domain,
                status: "checking"
            });

        res.status(201).json({
            success: true,
            message: "Keyword added for tracking",
            tracking: newTracking
        });

        keywordTracking(newTracking);

    } catch (error) {

        console.error(
            "Error adding keyword:",
            error.message
        );

        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message:
                    "Already tracking this keyword"
            });
        }

        res.status(500).json({
            success: false,
            message:
                "Server error while adding keyword"
        });
    }
};
//Get all tracked keywords for a user
export const getTrackedKeywords = async (req, res) => {
    try {
        const keywords = await KeywordTracking.find({userId: req.userId}).sort({createdAt: -1}).select("-rankHistory")
        res.json({success: true, keywords});
    } catch (error) {
        console.error("Get keywords error:", error.message);
        res.status(500).json({success: false, message: "Server Error"});
    }
}

//Get single keyword with full history
export const getSingleKeyword = async (req, res) => {
    try {
        const tracking = await KeywordTracking.findOne({_id: req.params.id, userId: req.userId})
        if(!tracking) return res.status(404).json({success: false, message: "Keyword not found"})   
        res.json({success: true, tracking});
    } catch (error) {
        console.error("Get keyword error:", error.message);
        res.status(500).json({success: false, message: "Server Error"});
    }
}

//Manually refresh the ranking data for a keyword
export const refreshKeyword = async (req, res) => {
    try {
        const tracking = await KeywordTracking.findOne({_id: req.params.id, userId: req.userId})
        if(!tracking) return res.status(404).json({success: false, message: "Keyword not found"});
        tracking.status = "checking";
        await tracking.save();
        res.json({success: true, message: "Rank checking started"});
        keywordTracking(tracking);
    } catch (error) {
        console.error("Refresh keyword error:", error.message);
        res.status(500).json({success: false, message: "Server Error"});
    }
}

//Delete a tracked keyword
export const deleteKeyword = async (req, res) => {
    try {
        const tracking = await KeywordTracking.findOneAndDelete({_id: req.params.id, userId: req.userId})
        if(!tracking) return res.status(404).json({success: false, message: "Keyword not found"});
        res.json({success: true, message: "Keyword deleted"});
    } catch (error) {
        console.error("Delete keyword error:", error.message);
        res.status(500).json({success: false, message: "Server Error"});
    }
}

//Toggle tracking status (active/inactive) for a keyword
export const toggleTrackingStatus = async (req, res) => {
    try {
        const tracking = await KeywordTracking.findOne({_id: req.params.id, userId: req.userId})
        if(!tracking) return res.status(404).json({success: false, message: "Keyword not found"});
        tracking.active = !tracking.active;
        await tracking.save();
        res.json({success: true, message: "Tracking status updated"});
    } catch (error) {
        console.error("Toggle tracking status error:", error.message);
        res.status(500).json({success: false, message: "Server Error"});
    }
}