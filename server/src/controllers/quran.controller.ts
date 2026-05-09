import { Request, Response } from "express"

// fetching all surah
export const getAllSurah = async (req: Request, res: Response) => {
    try {
        const response = await fetch("https://api.alquran.cloud/v1/surah")
        const data = await response.json()

        return res.status(200).json({ success: true, data: data.data })
    } catch (error: any) {
        return res.status(500).json({ success: false, msg: error.message || "Server Error" })
    }
}

// fetching single surah with translation
export const getSingleSurah = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const arabic = await fetch(`https://api.alquran.cloud/v1/surah/${id}`);
        const translation = await fetch(`https://api.alquran.cloud/v1/surah/${id}/en.asad`);
        const arabicData = await arabic.json();
        const translationData = await translation.json();

        return res.status(201).json({
            success: true,
            data: {
                arabic: arabicData.data,
                translation: translationData.data,
            }
        })
    } catch (error: any) {
        return res.status(500).json({ success: false, msg: error.message || "Server Error" })
    }
}