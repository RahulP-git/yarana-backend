const sendResponse = require("../utils/response");
const { SUCCESS } = require("../constants/statusCodes");

const homeData = {
    offer: {
        title: "SPECIAL OFFER",
        headline: "20% off your\nfirst service!",
        chipLabel: "YARANA20",
        icon: "card_giftcard_rounded",
        startColor: "#FF9A1F",
        endColor: "#FF7A00"
    },
    services: [
        { label: "Plumbing", image: "assets/images/plumber.png", backgroundColor: "#EAF3FF" },
        { label: "Painting", image: "assets/images/painting.png", backgroundColor: "#FFF0D8" },
        { label: "Electrical", image: "assets/images/faucet.png", backgroundColor: "#FFF5D1" },
        { label: "Cleaning", image: "assets/images/cleaning.png", backgroundColor: "#EAFBF0" },
        { label: "Carpentry", image: "assets/images/carpenter.png", backgroundColor: "#F1F1F7" },
        { label: "AC Repair", image: "assets/images/ac_repair.png", backgroundColor: "#E1F6FF" },
        { label: "Appliance", image: "assets/images/appliance.png", backgroundColor: "#F6F2EE" },
        { label: "Building", image: "assets/images/building.png", backgroundColor: "#E9F6E8" }
    ],
    nearbyProvider: {
        name: "Anand Electricals",
        category: "Electrical - 1.2 km",
        rating: "4.9",
        jobs: "128 jobs",
        price: "350",
        icon: "bolt_rounded"
    },
    providers: [
        { name: "Mike", trade: "Plumber", gradientStart: "#4C8DFF", gradientEnd: "#173A8F", avatarColor: "#2B6CB0" },
        { name: "Jessica", trade: "Beautician", gradientStart: "#FFA95F", gradientEnd: "#B24A08", avatarColor: "#F95A8B" },
        { name: "Kevin", trade: "Electrician", gradientStart: "#FFC74A", gradientEnd: "#D96D00", avatarColor: "#3A3F8C" },
        { name: "Anand", trade: "Electrical", gradientStart: "#26C281", gradientEnd: "#0B7A52", avatarColor: "#00B894" },
        { name: "Sophia", trade: "Cleaner", gradientStart: "#9B6CFF", gradientEnd: "#5A2FB0", avatarColor: "#6C5CE7" },
        { name: "David", trade: "Carpenter", gradientStart: "#3FA9F5", gradientEnd: "#0B5FA5", avatarColor: "#0984E3" },
        { name: "Riya", trade: "Painter", gradientStart: "#F0688C", gradientEnd: "#B1224E", avatarColor: "#E84393" }
    ],
    activities: [
        { title: "House Cleaning", subtitle: "You booked", status: "Completed - Today, 10:00 AM", icon: "check_rounded", iconBackground: "#66BB6A" },
        { title: "AC Repair Service", subtitle: "You booked", status: "In Progress - Yesterday, 2:30 PM", icon: "handyman_rounded", iconBackground: "#5C6BC0" }
    ],
    bottomNavItems: [
        { label: "Home", icon: "home_rounded", route: "/home" },
        { label: "Bookings", icon: "receipt_long_rounded", route: "/bookings" },
        { label: "Messages", icon: "mail_outline_rounded", route: "/messages", badgeCount: 2 },
        { label: "Profile", icon: "person_rounded", route: "/profile" }
    ]
};

const getHome = async (req, res) => {
    try {
        return sendResponse(
            res,
            SUCCESS,
            true,
            "Home data fetched successfully",
            homeData
        );
    } catch (error) {
        return sendResponse(
            res,
            500,
            false,
            error.message
        );
    }
};

module.exports = { getHome };
