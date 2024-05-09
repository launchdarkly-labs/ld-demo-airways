export const shouldClickRegister = ({ label }: { label: string }): boolean => {
  const rando = Math.floor(Math.random() * 10);
  switch (label) {
    case "Click the button!":
      return rando > 6;  // 30% chance
    case "Launch Now!":
      return rando > 8;  // 10% chance
    case "Register TODAY!":
      return rando > 2;  // 70% chance
    default:
      return rando > 7;  // 20% chance
  }
};

  
  export const shouldEnroll = (): boolean => {
    const rando = Math.floor(Math.random() * 10);
    return rando > 1;  // 80% chance
  };