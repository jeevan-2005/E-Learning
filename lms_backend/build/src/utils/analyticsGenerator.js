"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateLast12MonthsData = generateLast12MonthsData;
async function generateLast12MonthsData(model) {
    const last12Months = [];
    const currDate = new Date();
    currDate.setDate(currDate.getDate() + 1);
    for (let i = 11; i >= 0; i--) {
        const endDate = new Date(currDate.getFullYear(), currDate.getMonth(), currDate.getDate() - i * 28 // since every month has 28 days.
        );
        const startDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate() - 28);
        const monthYear = endDate.toLocaleString("default", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
        const documentCount = await model.countDocuments({
            createdAt: {
                $lte: endDate,
                $gte: startDate,
            },
        });
        last12Months.push({ month: monthYear, count: documentCount });
    }
    return { last12Months };
}
