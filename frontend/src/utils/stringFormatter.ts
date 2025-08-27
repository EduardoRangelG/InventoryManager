export const capitalizeFirstLetter = (originalString: string): string => {
  const capitalizedLetter = originalString.charAt(0).toUpperCase();
  const restOfString = originalString.slice(1);
  const capitalizedString = capitalizedLetter + restOfString;
  return capitalizedString;
};
