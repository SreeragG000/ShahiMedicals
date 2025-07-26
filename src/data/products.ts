import paracetamolImg from '@/assets/paracetamol.jpg';
import amoxicillinImg from '@/assets/amoxicillin.jpg';
import vitaminD3Img from '@/assets/vitamin-d3.jpg';
import coughSyrupImg from '@/assets/cough-syrup.jpg';
import bloodPressureMonitorImg from '@/assets/blood-pressure-monitor.jpg';
import insulinPenImg from '@/assets/insulin-pen.jpg';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  manufacturer: string;
  prescription: boolean;
  dosage?: string;
  sideEffects?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

// Sample medicine products data
export const products: Product[] = [
  {
    id: "1",
    name: "Paracetamol 500mg",
    description: "Pain reliever and fever reducer for adults and children",
    price: 25.99,
    category: "Pain Relief",
    image: paracetamolImg,
    stock: 150,
    manufacturer: "PharmaCorp",
    prescription: false,
    dosage: "500mg tablets - Take 1-2 tablets every 4-6 hours",
    sideEffects: "Mild stomach upset, dizziness"
  },
  {
    id: "2", 
    name: "Amoxicillin 250mg",
    description: "Antibiotic for bacterial infections",
    price: 45.50,
    category: "Antibiotics",
    image: amoxicillinImg,
    stock: 75,
    manufacturer: "MediLife",
    prescription: true,
    dosage: "250mg capsules - Take as prescribed by doctor",
    sideEffects: "Nausea, diarrhea, allergic reactions"
  },
  {
    id: "3",
    name: "Vitamin D3 1000 IU",
    description: "Essential vitamin supplement for bone health",
    price: 18.99,
    category: "Vitamins",
    image: vitaminD3Img,
    stock: 200,
    manufacturer: "HealthPlus",
    prescription: false,
    dosage: "1000 IU tablets - Take 1 tablet daily with food"
  },
  {
    id: "4",
    name: "Cough Syrup",
    description: "Effective relief for dry and wet cough",
    price: 12.75,
    category: "Cold & Flu",
    image: coughSyrupImg,
    stock: 90,
    manufacturer: "CoughCure",
    prescription: false,
    dosage: "10ml every 4-6 hours, maximum 6 doses per day"
  },
  {
    id: "5",
    name: "Blood Pressure Monitor",
    description: "Digital automatic blood pressure monitor",
    price: 89.99,
    category: "Medical Devices",
    image: bloodPressureMonitorImg,
    stock: 25,
    manufacturer: "MedDevice",
    prescription: false
  },
  {
    id: "6",
    name: "Insulin Pen",
    description: "Disposable insulin pen for diabetes management",
    price: 125.00,
    category: "Diabetes Care",
    image: insulinPenImg,
    stock: 40,
    manufacturer: "DiabeCare",
    prescription: true,
    dosage: "As prescribed by endocrinologist"
  }
];

export const categories = [
  "All Categories",
  "Pain Relief", 
  "Antibiotics",
  "Vitamins",
  "Cold & Flu",
  "Medical Devices",
  "Diabetes Care"
];