export const maggie = {
  username: "MaggieSimpson",
  email: "maggie@simpson.com",
  password: "secret",
};

export const testUsers = [
  {
    username: "HomerSimpson",
    email: "homer@simpson.com",
    password: "secret",
  },
  {
    username: "Marge",
    email: "marge@simpson.com",
    password: "secret",
  },
  {
    username: "Bart",
    email: "bart@simpson.com",
    password: "secret",
  },
];

export const serviceUrl = process.env.SERVICE_URL ?? "http://localhost:3000";

export const mozart = {
    username: "Mozart",
    email: "mozart@beethoven.com",
    password: "secret",
    userId: "",
};

export const testPlacemarks = [
  { title: "A", userId: "", category: "marina", images: [] },
  { title: "B", userId: "", category: "marina", images: [] },
  { title: "C", userId: "", category: "marina", images: [] }
    ];

export const testPlacemark = { title: "Test Placemark", userId: "", category: "marina", images: [] };

export const concerto = {
  pmId: "",
  latitude: 51.5,
  longitude: -0.1,
  title: "Tower",
  description: "Tall tower",
};

export const testDetails = [
  { pmId: "", latitude: 1, longitude: 1, title: "A", description: "a" },
  { pmId: "", latitude: 2, longitude: 2, title: "B", description: "b" },
  { pmId: "", latitude: 3, longitude: 3, title: "C", description: "c" },
];

