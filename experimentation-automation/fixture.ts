export const shouldClickRegister = ({ label }: { label: string }): boolean => {
    const rando = Math.floor(Math.random() * 10);
    switch (label) {
      case "Explore More":
        return rando > 6;  // 40% chance
      case "Launch Now!":
        return rando > 3;  // 80% chance
      case "Seize the Moment!":
        return rando > 4;  // 60% chance
      default:
        return rando > 7;  // 30% chance
    }
  };
  
  export const shouldEnroll = (): boolean => {
    const rando = Math.floor(Math.random() * 10);
    return rando > 1;  // 80% chance
  };