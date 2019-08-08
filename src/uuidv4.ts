// https://stackoverflow.com/questions/26501688/a-typescript-guid-class
export default function uuidv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0; // tslint:disable-line no-bitwise
    return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16); // tslint:disable-line no-bitwise
  });
}
