export const INDIA_DATA: Record<string, string[]> = {
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Tirupati", "Rajahmundry", "Kakinada", "Kadapa", "Anantapur", "Eluru", "Ongole", "Srikakulam", "Nandyal"],
  "Arunachal Pradesh": ["Itanagar", "Naharlagun", "Pasighat", "Roing", "Tawang", "Ziro", "Bomdila"],
  "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon", "Tinsukia", "Tezpur", "Bongaigaon", "Karimganj"],
  "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia", "Darbhanga", "Arrah", "Begusarai", "Chapra", "Katihar"],
  "Chhattisgarh": ["Raipur", "Bhilai", "Bilaspur", "Korba", "Rajnandgaon", "Jagdalpur", "Ambikapur", "Durg", "Raigarh"],
  "Goa": ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda", "Quepem"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Junagadh", "Gandhinagar", "Anand", "Gandhidham", "Morbi"],
  "Haryana": ["Faridabad", "Gurgaon", "Panipat", "Ambala", "Yamunanagar", "Rohtak", "Hisar", "Karnal", "Sonipat", "Panchkula"],
  "Himachal Pradesh": ["Shimla", "Dharamshala", "Solan", "Mandi", "Palampur", "Baddi", "Una", "Kullu"],
  "Jharkhand": ["Jamshedpur", "Dhanbad", "Ranchi", "Bokaro Steel City", "Deoghar", "Phusro", "Hazaribagh", "Giridih", "Ramgarh"],
  "Karnataka": ["Bengaluru", "Hubballi-Dharwad", "Mysuru", "Belagavi", "Mangaluru", "Davanagere", "Ballari", "Vijayapura", "Shimoga", "Tumakuru", "Udupi"],
  "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Kollam", "Thrissur", "Kannur", "Alappuzha", "Palakkad", "Kottayam", "Malappuram"],
  "Madhya Pradesh": ["Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Dewas", "Satna", "Ratlam", "Rewa", "Chhindwara"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Pimpri-Chinchwad", "Nashik", "Kalyan-Dombivli", "Vasai-Virar", "Aurangabad", "Navi Mumbai", "Solapur", "Kolhapur", "Sangli", "Amravati", "Akola"],
  "Manipur": ["Imphal", "Thoubal", "Bishnupur", "Churachandpur", "Ukhrul"],
  "Meghalaya": ["Shillong", "Tura", "Jowai", "Nongpoh", "Nongstoin"],
  "Mizoram": ["Aizawl", "Lunglei", "Saiha", "Champhai", "Serchhip"],
  "Nagaland": ["Dimapur", "Kohima", "Zunheboto", "Tuensang", "Wokha"],
  "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur", "Puri", "Balasore", "Jharsuguda", "Bargarh"],
  "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali", "Pathankot", "Hoshiarpur", "Moga", "Ferozepur"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Kota", "Bikaner", "Ajmer", "Udaipur", "Bhilwara", "Alwar", "Sikar", "Kishangarh", "Chittorgarh"],
  "Sikkim": ["Gangtok", "Namchi", "Gyalshing", "Mangan", "Rangpo"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Tiruppur", "Ambattur", "Erode", "Vellore", "Thoothukudi"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Khammam", "Karimnagar", "Ramagundam", "Mahbubnagar", "Nalgonda", "Adilabad"],
  "Tripura": ["Agartala", "Udaipur", "Dharmanagar", "Kailasahar", "Belonia"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Ghaziabad", "Agra", "Meerut", "Varanasi", "Prayagraj", "Bareilly", "Aligarh", "Moradabad", "Noida", "Gorakhpur", "Jhansi", "Saharanpur", "Faizabad"],
  "Uttarakhand": ["Dehradun", "Haridwar", "Roorkee", "Haldwani", "Rudrapur", "Kashipur", "Nainital", "Pithoragarh"],
  "West Bengal": ["Kolkata", "Howrah", "Asansol", "Siliguri", "Durgapur", "Maheshtala", "Rajpur Sonarpur", "Gopalpur", "Kharagpur", "Baharampur"],
  "Delhi": ["New Delhi", "North Delhi", "South Delhi", "West Delhi", "East Delhi", "Central Delhi"],
  "Jammu & Kashmir": ["Srinagar", "Jammu", "Anantnag", "Baramulla", "Kathua"],
  "Ladakh": ["Leh", "Kargil", "Drass"],
  "Puducherry": ["Puducherry", "Karaikal", "Mahe", "Yanam", "Ozhukarai"],
  "Chandigarh": ["Chandigarh"],
  "Andaman & Nicobar": ["Port Blair", "Car Nicobar"],
  "Dadra & Nagar Haveli": ["Silvassa", "Dadra", "Naroli"],
  "Daman & Diu": ["Daman", "Diu", "Moti Daman"],
  "Lakshadweep": ["Kavaratti", "Agatti", "Amini"]
};

export const STATES = Object.keys(INDIA_DATA);
export const COUNTRIES = ["India"];

export type Severity = "high" | "medium" | "low";
export type Status = "pending" | "in-progress" | "resolved";

export interface Issue {
  id: string;
  title: string;
  description: string;
  type: string;
  location: string;
  severity: Severity;
  status: Status;
  reporter: string;
  reportedAt: string;
  x: number; // map %
  y: number;
}

export const ISSUES: Issue[] = [
  { id: "I-2041", title: "Overflowing trash bin", description: "Bin near park entrance has not been collected for 3 days.", type: "Garbage", location: "MG Road, Bengaluru", severity: "high", status: "pending", reporter: "Aarav S.", reportedAt: "2h ago", x: 32, y: 28 },
  { id: "I-2042", title: "Open drainage", description: "Open manhole creates safety hazard for kids.", type: "Drainage", location: "Sector 14, Delhi", severity: "high", status: "in-progress", reporter: "Meera K.", reportedAt: "5h ago", x: 58, y: 40 },
  { id: "I-2043", title: "Plastic littering on beach", description: "Heavy plastic waste washed up after weekend.", type: "Littering", location: "Marina Beach, Chennai", severity: "medium", status: "pending", reporter: "Ravi P.", reportedAt: "1d ago", x: 70, y: 62 },
  { id: "I-2044", title: "Compost pit needed", description: "Village requests support for community compost area.", type: "Composting", location: "Anand village, Gujarat", severity: "low", status: "resolved", reporter: "Sita D.", reportedAt: "3d ago", x: 22, y: 70 },
  { id: "I-2045", title: "Stagnant water pool", description: "Mosquito breeding risk near school.", type: "Water", location: "Old Quarter, Kochi", severity: "medium", status: "in-progress", reporter: "Anil J.", reportedAt: "6h ago", x: 48, y: 55 },
  { id: "I-2046", title: "Broken public toilet", description: "Door latch broken, no water supply.", type: "Sanitation", location: "Bus stand, Amritsar", severity: "high", status: "pending", reporter: "Jaspreet K.", reportedAt: "12h ago", x: 38, y: 18 },
];

export const ISSUE_TYPES = ["Garbage", "Drainage", "Littering", "Composting", "Water", "Sanitation", "Other"];

export const CHALLENGES = [
  { id: 1, title: "Pick 5 pieces of litter", points: 20, category: "Daily" },
  { id: 2, title: "Use a reusable water bottle today", points: 10, category: "Habit" },
  { id: 3, title: "Segregate waste at home", points: 25, category: "Home" },
  { id: 4, title: "Plant a sapling", points: 50, category: "Weekly" },
  { id: 5, title: "Share an awareness post", points: 15, category: "Social" },
  { id: 6, title: "Avoid single-use plastic for a day", points: 30, category: "Daily" },
];

export const STORIES = [
  { id: 1, title: "Bengaluru's Lake Revival", text: "How a community brought back life to a dying urban lake.", tag: "Urban", img: "story-urban" },
  { id: 2, title: "Anand's Compost Movement", text: "A village turning daily waste into rich farm gold.", tag: "Rural", img: "story-rural" },
  { id: 3, title: "Recycle Rangers", text: "School kids leading the segregation revolution.", tag: "Education", img: "story-kids" },
  { id: 4, title: "Plastic-Free Marina", text: "Weekend volunteers cleaning Chennai's iconic beach.", tag: "Urban", img: "story-urban" },
  { id: 5, title: "Solar Toilets", text: "Rural Punjab brings clean sanitation to every home.", tag: "Rural", img: "story-rural" },
];

export const USERS = [
  { id: "U-01", name: "Aarav Sharma", email: "aarav@example.com", city: "Bengaluru", area: "Urban", points: 320 },
  { id: "U-02", name: "Meera Kumar", email: "meera@example.com", city: "Delhi", area: "Urban", points: 280 },
  { id: "U-03", name: "Sita Devi", email: "sita@example.com", city: "Anand", area: "Rural", points: 410 },
  { id: "U-04", name: "Ravi Patel", email: "ravi@example.com", city: "Chennai", area: "Urban", points: 195 },
  { id: "U-05", name: "Jaspreet Kaur", email: "jaspreet@example.com", city: "Amritsar", area: "Urban", points: 240 },
];
