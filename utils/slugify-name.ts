export const slugifyName = (name: string): string => {
    return name
      .toLowerCase() // tout en minuscule
      .normalize("NFD") // décompose les accents
      .replace(/[\u0300-\u036f]/g, "") // supprime les accents
      .replace(/[^a-z0-9\s-]/g, "") // supprime tout caractère spécial
      .trim() // supprime les espaces au début/fin
      .replace(/\s+/g, "-"); // remplace les espaces par des tirets
  };