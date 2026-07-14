export type RolUsuario = "admin" | "medico" | "farmaceutico" | "paciente";

export type Usuario = {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: RolUsuario;
  telefono: string;
  cedula: string;
  activo: boolean;
  creadoEn: string;
};

export type CategoriaMedicamento =
  | "antibiotico"
  | "analgesico"
  | "antihipertensivo"
  | "antidiabetico"
  | "antiinflamatorio"
  | "vitamina"
  | "antihistaminico"
  | "cardiovascular";

export type Medicamento = {
  id: string;
  nombre: string;
  nombreGenerico: string;
  laboratorio: string;
  categoria: CategoriaMedicamento;
  presentacion: string;
  concentracion: string;
  requiereReceta: boolean;
  precio: number;
  descripcion: string;
  codigoBarras: string;
  activo: boolean;
};

export type EstadoInventario = "disponible" | "bajo_stock" | "agotado" | "vencido";

export type Inventario = {
  id: string;
  medicamentoId: string;
  medicamentoNombre: string;
  lote: string;
  cantidad: number;
  cantidadMinima: number;
  fechaVencimiento: string;
  fechaIngreso: string;
  ubicacion: string;
  estado: EstadoInventario;
  proveedorNombre: string;
  costoUnitario: number;
};

export type EstadoReceta = "pendiente" | "verificada" | "dispensada" | "rechazada" | "vencida";

export type ItemReceta = {
  medicamentoId: string;
  medicamentoNombre: string;
  dosis: string;
  frecuencia: string;
  duracion: string;
  cantidad: number;
  indicaciones: string;
};

export type Receta = {
  id: string;
  codigoReceta: string;
  pacienteId: string;
  pacienteNombre: string;
  medicoId: string;
  medicoNombre: string;
  farmaceuticoId: string | null;
  farmaceuticoNombre: string | null;
  items: ItemReceta[];
  estado: EstadoReceta;
  diagnostico: string;
  fechaEmision: string;
  fechaVencimiento: string;
  fechaDispensacion: string | null;
  observaciones: string;
  totalEstimado: number;
};

export const usuarios: Usuario[] = [
  {
    id: "usr-001",
    nombre: "Carlos",
    apellido: "Mendoza Rivera",
    email: "c.mendoza@hospitalcentral.com",
    rol: "admin",
    telefono: "+593 99 812 4431",
    cedula: "1723456789",
    activo: true,
    creadoEn: "2024-01-10T08:00:00Z",
  },
  {
    id: "usr-002",
    nombre: "Dra. Ana",
    apellido: "Paredes Lozano",
    email: "ana.paredes@hospitalcentral.com",
    rol: "medico",
    telefono: "+593 98 765 4321",
    cedula: "1756789012",
    activo: true,
    creadoEn: "2024-02-14T09:30:00Z",
  },
  {
    id: "usr-003",
    nombre: "Jorge",
    apellido: "Castillo Vera",
    email: "j.castillo@hospitalcentral.com",
    rol: "farmaceutico",
    telefono: "+593 99 234 5678",
    cedula: "1734567890",
    activo: true,
    creadoEn: "2024-01-20T10:00:00Z",
  },
  {
    id: "usr-004",
    nombre: "María Elena",
    apellido: "Torres Gutiérrez",
    email: "matorres@gmail.com",
    rol: "paciente",
    telefono: "+593 97 654 3210",
    cedula: "1745678901",
    activo: true,
    creadoEn: "2024-03-05T11:15:00Z",
  },
  {
    id: "usr-005",
    nombre: "Dr. Roberto",
    apellido: "Sánchez Flores",
    email: "r.sanchez@hospitalcentral.com",
    rol: "medico",
    telefono: "+593 98 111 2233",
    cedula: "1712345670",
    activo: true,
    creadoEn: "2024-01-15T08:45:00Z",
  },
  {
    id: "usr-006",
    nombre: "Lucía",
    apellido: "Ramírez Ochoa",
    email: "lucia.ramirez@gmail.com",
    rol: "paciente",
    telefono: "+593 99 987 6543",
    cedula: "1767890123",
    activo: true,
    creadoEn: "2024-04-12T14:20:00Z",
  },
  {
    id: "usr-007",
    nombre: "Patricio",
    apellido: "Herrera Montoya",
    email: "p.herrera@hospitalcentral.com",
    rol: "farmaceutico",
    telefono: "+593 98 444 5566",
    cedula: "1778901234",
    activo: false,
    creadoEn: "2024-02-28T09:00:00Z",
  },
];

export const medicamentos: Medicamento[] = [
  {
    id: "med-001",
    nombre: "Amoxicilina 500mg Cápsulas",
    nombreGenerico: "Amoxicilina",
    laboratorio: "Pfizer",
    categoria: "antibiotico",
    presentacion: "Cápsulas",
    concentracion: "500mg",
    requiereReceta: true,
    precio: 8.5,
    descripcion: "Antibiótico de amplio espectro para infecciones bacterianas del tracto respiratorio, urinario y piel.",
    codigoBarras: "7861234560011",
    activo: true,
  },
  {
    id: "med-002",
    nombre: "Metformina 850mg Tabletas",
    nombreGenerico: "Metformina HCl",
    laboratorio: "Merck",
    categoria: "antidiabetico",
    presentacion: "Tabletas",
    concentracion: "850mg",
    requiereReceta: true,
    precio: 6.25,
    descripcion: "Agente hipoglucemiante oral para el tratamiento de diabetes mellitus tipo 2.",
    codigoBarras: "7861234560022",
    activo: true,
  },
  {
    id: "med-003",
    nombre: "Ibuprofeno 400mg Tabletas",
    nombreGenerico: "Ibuprofeno",
    laboratorio: "Bayer",
    categoria: "antiinflamatorio",
    presentacion: "Tabletas recubiertas",
    concentracion: "400mg",
    requiereReceta: false,
    precio: 3.75,
    descripcion: "Antiinflamatorio no esteroideo (AINE) para dolor, fiebre e inflamación.",
    codigoBarras: "7861234560033",
    activo: true,
  },
  {
    id: "med-004",
    nombre: "Losartán 50mg Tabletas",
    nombreGenerico: "Losartán Potásico",
    laboratorio: "Novartis",
    categoria: "antihipertensivo",
    presentacion: "Tabletas",
    concentracion: "50mg",
    requiereReceta: true,
    precio: 12.0,
    descripcion: "Antagonista de los receptores de angiotensina II para el tratamiento de hipertensión arterial.",
    codigoBarras: "7861234560044",
    activo: true,
  },
  {
    id: "med-005",
    nombre: "Loratadina 10mg Tabletas",
    nombreGenerico: "Loratadina",
    laboratorio: "MK Colombia",
    categoria: "antihistaminico",
    presentacion: "Tabletas",
    concentracion: "10mg",
    requiereReceta: false,
    precio: 4.5,
    descripcion: "Antihistamínico de segunda generación para rinitis alérgica y urticaria.",
    codigoBarras: "7861234560055",
    activo: true,
  },
  {
    id: "med-006",
    nombre: "Atorvastatina 20mg Tabletas",
    nombreGenerico: "Atorvastatina Cálcica",
    laboratorio: "AstraZeneca",
    categoria: "cardiovascular",
    presentacion: "Tabletas recubiertas",
    concentracion: "20mg",
    requiereReceta: true,
    precio: 18.9,
    descripcion: "Inhibidor de HMG-CoA reductasa para la reducción del colesterol LDL y prevención cardiovascular.",
    codigoBarras: "7861234560066",
    activo: true,
  },
  {
    id: "med-007",
    nombre: "Paracetamol 500mg Tabletas",
    nombreGenerico: "Paracetamol (Acetaminofén)",
    laboratorio: "GlaxoSmithKline",
    categoria: "analgesico",
    presentacion: "Tabletas",
    concentracion: "500mg",
    requiereReceta: false,
    precio: 2.1,
    descripcion: "Analgésico y antipirético de uso general para dolor leve a moderado y fiebre.",
    codigoBarras: "7861234560077",
    activo: true,
  },
  {
    id: "med-008",
    nombre: "Vitamina D3 1000UI Cápsulas",
    nombreGenerico: "Colecalciferol",
    laboratorio: "Solgar",
    categoria: "vitamina",
    presentacion: "Cápsulas blandas",
    concentracion: "1000 UI",
    requiereReceta: false,
    precio: 15.6,
    descripcion: "Suplemento de vitamina D3 para la absorción de calcio, salud ósea e inmunidad.",
    codigoBarras: "7861234560088",
    activo: true,
  },
];

export const inventario: Inventario[] = [
  {
    id: "inv-001",
    medicamentoId: "med-001",
    medicamentoNombre: "Amoxicilina 500mg Cápsulas",
    lote: "LOT-2024-A1001",
    cantidad: 350,
    cantidadMinima: 50,
    fechaVencimiento: "2026-08-31",
    fechaIngreso: "2024-08-15",
    ubicacion: "Estante A-01",
    estado: "disponible",
    proveedorNombre: "Farmacias Industriales S.A.",
    costoUnitario: 5.2,
  },
  {
    id: "inv-002",
    medicamentoId: "med-002",
    medicamentoNombre: "Metformina 850mg Tabletas",
    lote: "LOT-2024-B2002",
    cantidad: 28,
    cantidadMinima: 50,
    fechaVencimiento: "2026-12-15",
    fechaIngreso: "2024-09-01",
    ubicacion: "Estante B-03",
    estado: "bajo_stock",
    proveedorNombre: "Distribuidora MediPharma",
    costoUnitario: 3.8,
  },
  {
    id: "inv-003",
    medicamentoId: "med-003",
    medicamentoNombre: "Ibuprofeno 400mg Tabletas",
    lote: "LOT-2024-C3003",
    cantidad: 520,
    cantidadMinima: 80,
    fechaVencimiento: "2027-03-20",
    fechaIngreso: "2024-07-10",
    ubicacion: "Estante C-02",
    estado: "disponible",
    proveedorNombre: "Bayer Ecuador",
    costoUnitario: 2.1,
  },
  {
    id: "inv-004",
    medicamentoId: "med-004",
    medicamentoNombre: "Losartán 50mg Tabletas",
    lote: "LOT-2024-D4004",
    cantidad: 0,
    cantidadMinima: 40,
    fechaVencimiento: "2026-06-30",
    fechaIngreso: "2024-06-20",
    ubicacion: "Estante D-01",
    estado: "agotado",
    proveedorNombre: "Novartis Ecuador",
    costoUnitario: 7.5,
  },
  {
    id: "inv-005",
    medicamentoId: "med-005",
    medicamentoNombre: "Loratadina 10mg Tabletas",
    lote: "LOT-2024-E5005",
    cantidad: 210,
    cantidadMinima: 60,
    fechaVencimiento: "2025-12-01",
    fechaIngreso: "2023-12-10",
    ubicacion: "Estante E-04",
    estado: "vencido",
    proveedorNombre: "MK Pharma S.A.",
    costoUnitario: 2.6,
  },
  {
    id: "inv-006",
    medicamentoId: "med-006",
    medicamentoNombre: "Atorvastatina 20mg Tabletas",
    lote: "LOT-2024-F6006",
    cantidad: 180,
    cantidadMinima: 30,
    fechaVencimiento: "2027-01-10",
    fechaIngreso: "2024-10-01",
    ubicacion: "Estante F-02",
    estado: "disponible",
    proveedorNombre: "AstraZeneca Andes",
    costoUnitario: 11.4,
  },
  {
    id: "inv-007",
    medicamentoId: "med-007",
    medicamentoNombre: "Paracetamol 500mg Tabletas",
    lote: "LOT-2024-G7007",
    cantidad: 44,
    cantidadMinima: 100,
    fechaVencimiento: "2026-09-15",
    fechaIngreso: "2024-09-15",
    ubicacion: "Estante G-01",
    estado: "bajo_stock",
    proveedorNombre: "GSK Ecuador",
    costoUnitario: 1.1,
  },
  {
    id: "inv-008",
    medicamentoId: "med-008",
    medicamentoNombre: "Vitamina D3 1000UI Cápsulas",
    lote: "LOT-2024-H8008",
    cantidad: 95,
    cantidadMinima: 20,
    fechaVencimiento: "2027-06-30",
    fechaIngreso: "2024-10-05",
    ubicacion: "Estante H-03",
    estado: "disponible",
    proveedorNombre: "Suplementos Andinos Cía.",
    costoUnitario: 9.0,
  },
];

export const recetas: Receta[] = [
  {
    id: "rec-001",
    codigoReceta: "RX-2026-00145",
    pacienteId: "usr-004",
    pacienteNombre: "María Elena Torres Gutiérrez",
    medicoId: "usr-002",
    medicoNombre: "Dra. Ana Paredes Lozano",
    farmaceuticoId: "usr-003",
    farmaceuticoNombre: "Jorge Castillo Vera",
    items: [
      {
        medicamentoId: "med-001",
        medicamentoNombre: "Amoxicilina 500mg Cápsulas",
        dosis: "500mg",
        frecuencia: "Cada 8 horas",
        duracion: "7 días",
        cantidad: 21,
        indicaciones: "Tomar con alimentos. Completar todo el tratamiento.",
      },
      {
        medicamentoId: "med-007",
        medicamentoNombre: "Paracetamol 500mg Tabletas",
        dosis: "500mg",
        frecuencia: "Cada 6 horas si hay fiebre",
        duracion: "5 días",
        cantidad: 20,
        indicaciones: "Solo en caso de temperatura mayor a 38°C.",
      },
    ],
    estado: "dispensada",
    diagnostico: "Faringitis bacteriana aguda (J02.0)",
    fechaEmision: "2026-07-01",
    fechaVencimiento: "2026-07-31",
    fechaDispensacion: "2026-07-02",
    observaciones: "Paciente sin alergias conocidas a penicilinas confirmado.",
    totalEstimado: 220.5,
  },
  {
    id: "rec-002",
    codigoReceta: "RX-2026-00146",
    pacienteId: "usr-006",
    pacienteNombre: "Lucía Ramírez Ochoa",
    medicoId: "usr-005",
    medicoNombre: "Dr. Roberto Sánchez Flores",
    farmaceuticoId: null,
    farmaceuticoNombre: null,
    items: [
      {
        medicamentoId: "med-002",
        medicamentoNombre: "Metformina 850mg Tabletas",
        dosis: "850mg",
        frecuencia: "Dos veces al día con las comidas",
        duracion: "30 días",
        cantidad: 60,
        indicaciones: "Iniciar con una tableta al día la primera semana.",
      },
      {
        medicamentoId: "med-004",
        medicamentoNombre: "Losartán 50mg Tabletas",
        dosis: "50mg",
        frecuencia: "Una vez al día en la mañana",
        duracion: "30 días",
        cantidad: 30,
        indicaciones: "Monitorear presión arterial diariamente.",
      },
    ],
    estado: "verificada",
    diagnostico: "Diabetes mellitus tipo 2 con hipertensión arterial (E11 + I10)",
    fechaEmision: "2026-07-10",
    fechaVencimiento: "2026-08-10",
    fechaDispensacion: null,
    observaciones: "Control médico en 30 días con resultados de HbA1c y perfil lipídico.",
    totalEstimado: 555.0,
  },
  {
    id: "rec-003",
    codigoReceta: "RX-2026-00147",
    pacienteId: "usr-004",
    pacienteNombre: "María Elena Torres Gutiérrez",
    medicoId: "usr-002",
    medicoNombre: "Dra. Ana Paredes Lozano",
    farmaceuticoId: null,
    farmaceuticoNombre: null,
    items: [
      {
        medicamentoId: "med-006",
        medicamentoNombre: "Atorvastatina 20mg Tabletas",
        dosis: "20mg",
        frecuencia: "Una vez al día en la noche",
        duracion: "90 días",
        cantidad: 90,
        indicaciones: "Evitar consumo de toronja. Control hepático a los 3 meses.",
      },
    ],
    estado: "pendiente",
    diagnostico: "Hipercolesterolemia primaria (E78.0)",
    fechaEmision: "2026-07-13",
    fechaVencimiento: "2026-08-13",
    fechaDispensacion: null,
    observaciones: "Paciente con antecedentes familiares de enfermedad coronaria.",
    totalEstimado: 1701.0,
  },
  {
    id: "rec-004",
    codigoReceta: "RX-2026-00132",
    pacienteId: "usr-006",
    pacienteNombre: "Lucía Ramírez Ochoa",
    medicoId: "usr-005",
    medicoNombre: "Dr. Roberto Sánchez Flores",
    farmaceuticoId: "usr-003",
    farmaceuticoNombre: "Jorge Castillo Vera",
    items: [
      {
        medicamentoId: "med-005",
        medicamentoNombre: "Loratadina 10mg Tabletas",
        dosis: "10mg",
        frecuencia: "Una vez al día",
        duracion: "14 días",
        cantidad: 14,
        indicaciones: "Preferiblemente por la noche. No manejar si presenta somnolencia.",
      },
      {
        medicamentoId: "med-003",
        medicamentoNombre: "Ibuprofeno 400mg Tabletas",
        dosis: "400mg",
        frecuencia: "Cada 8 horas con alimentos",
        duracion: "5 días",
        cantidad: 15,
        indicaciones: "No exceder dosis máxima diaria de 1200mg sin supervisión médica.",
      },
    ],
    estado: "rechazada",
    diagnostico: "Rinitis alérgica estacional con sinusitis (J30.1 + J32.0)",
    fechaEmision: "2026-06-01",
    fechaVencimiento: "2026-07-01",
    fechaDispensacion: null,
    observaciones: "Receta rechazada: medicamento Loratadina sin stock vigente (lote vencido). Notificar al médico tratante.",
    totalEstimado: 119.25,
  },
  {
    id: "rec-005",
    codigoReceta: "RX-2026-00148",
    pacienteId: "usr-006",
    pacienteNombre: "Lucía Ramírez Ochoa",
    medicoId: "usr-002",
    medicoNombre: "Dra. Ana Paredes Lozano",
    farmaceuticoId: null,
    farmaceuticoNombre: null,
    items: [
      {
        medicamentoId: "med-008",
        medicamentoNombre: "Vitamina D3 1000UI Cápsulas",
        dosis: "1000 UI",
        frecuencia: "Una vez al día con el desayuno",
        duracion: "60 días",
        cantidad: 60,
        indicaciones: "Tomar con vitamina K2 si es posible para mejor absorción ósea.",
      },
    ],
    estado: "pendiente",
    diagnostico: "Deficiencia de vitamina D (E55.9)",
    fechaEmision: "2026-07-14",
    fechaVencimiento: "2026-08-14",
    fechaDispensacion: null,
    observaciones: "Nivel sérico de 25-OH vitamina D: 14 ng/mL. Repetir análisis en 2 meses.",
    totalEstimado: 936.0,
  },
];