
// Add a keyword to track
export const addKeyword = async (req, res) => {
    try {
        const { keyword, url } = req.body;

        if (!keyword || !url) {
            return res.status(400).json({ message: "Keyword and URL are required" });
        }

        // Sanitize keyword
        const trimmedKeyword = keyword.trim();
        if (!trimmedKeyword || trimmedKeyword.length > 100) {
            return res.status(400).json({ message: "Keyword must be between 1 and 100 characters" });
        }

        // Validate and normalize URL
        let domain, normalizedUrl;
        try {
            const parsedUrl = new URL(url);
            parsedUrl.hostname = parsedUrl.hostname.toLowerCase();
            normalizedUrl = parsedUrl.toString();
            domain = parsedUrl.hostname;
        } catch {
            return res.status(400).json({ message: "Invalid URL format" });
        }

        const newTracking = new KeywordTracking({
            userId: req.user._id,
            keyword: trimmedKeyword.toLowerCase(),
            url: normalizedUrl,
            domain,
            status: 'checking' 
        });

        try {
            await newTracking.save();
        } catch (error) {
            if (error.code === 11000) {
                return res.status(400).json({ message: "This keyword is already being tracked for the specified URL" });
            }
            throw error;
        }

        res.status(201).json({ message: "Keyword added for tracking", tracking: newTracking });

    } catch (error) {
        console.error("Error adding keyword:", error);
        res.status(500).json({ message: "Server error while adding keyword" });
    }
}

//Get all tracked keywords for a user
export const getTrackedKeywords = async (req, res) => {

}

//Get single keyword with full history
export const getSingleKeyword = async (req, res) => {

}

//Manually refresh the ranking data for a keyword
export const refreshKeyword = async (req, res) => {

}

//Delete a tracked keyword
export const deleteKeyword = async (req, res) => {

}

//Toggle tracking status (active/inactive) for a keyword
export const toggleTrackingStatus = async (req, res) => {

}