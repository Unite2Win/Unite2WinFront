import { RouteInfo } from "./vertical-sidebar.metadata";

export const ROUTES: RouteInfo[] = [
  {
    path: "",
    title: "Personal",
    icon: "mdi mdi-dots-horizontal",
    class: "nav-small-cap",
    extralink: true,
    label: "",
    labelClass: "",
    submenu: [],
  },
  {
    path: "/usuario/inicio",
    title: "Inicio",
    icon: "home",
    class: "",
    label: "",
    labelClass: "side-badge badge bg-success",
    extralink: false,
    submenu: [],
  },
  {
    path: "/usuario/objetivos",
    title: "Mis Objetivos",
    icon: "calendar",
    class: "",
    label: "",
    labelClass: "side-badge badge bg-success",
    extralink: false,
    submenu: [],
  },
  // {
  //   path: "/usuario/eventos",
  //   title: "Mis Eventos",
  //   icon: "book",
  //   class: "",
  //   label: "",
  //   labelClass: "side-badge badge bg-success",
  //   extralink: false,
  //   submenu: [],
  // },
  {
    path: "/usuario/explorar",
    title: "Explorar",
    icon: "compass",
    class: "",
    label: "",
    labelClass: "side-badge badge bg-success",
    extralink: false,
    submenu: [],
  },
  {
    path: "/usuario/miscomunidades",
    title: "Mis Comunidades",
    icon: "users",
    class: "",
    label: "",
    labelClass: "side-badge badge bg-success",
    extralink: false,
    submenu: [],
  },
  {
    path: "/usuario/chatgpt",
    title: "UniteAI",
    icon: "mdi mdi-robot",
    class: "",
    label: "BOT",
    labelClass: "side-badge badge bg-success",
    extralink: false,
    submenu: [],
  },
  {
    path: "administracion",
    title: "Administración",
    icon: "settings",
    class: "has-arrow zero-level mn-admin",
    label: "",
    labelClass: "side-badge badge bg-info",
    extralink: false,
    submenu: [
      {
        path: "/administracion/comunidades",
        title: "Comunidades",
        icon: "users",
        class: "level-one",
        label: "",
        labelClass: "",
        extralink: false,
        submenu: [],
      }
    ],
  },
];
