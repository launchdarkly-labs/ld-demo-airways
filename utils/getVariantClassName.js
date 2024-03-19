export const getVariantClassName = (variant) => {
    switch (variant) {
      case 'airlines':
        return 'bg-gradient-to-r from-airlinepurple to-airlinepink text-white';
      default:
        return '';
    }
  };