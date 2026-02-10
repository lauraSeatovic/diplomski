import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

type SecondsNanos =
  | { seconds: number; nanoseconds?: number }
  | { _seconds: number; _nanoseconds?: number };

export function timestampToDate(value: unknown): Date {
  if (value && typeof value === "object" && typeof (value as any).toDate === "function") {
    return (value as FirebaseFirestoreTypes.Timestamp).toDate();
  }

  if (value && typeof value === "object") {
    const v = value as any;

    const seconds =
      typeof v.seconds === "number"
        ? v.seconds
        : typeof v._seconds === "number"
        ? v._seconds
        : null;

    const nanos =
      typeof v.nanoseconds === "number"
        ? v.nanoseconds
        : typeof v._nanoseconds === "number"
        ? v._nanoseconds
        : 0;

    if (seconds != null) {
      return new Date(seconds * 1000 + Math.floor(nanos / 1e6));
    }
  }

  if (typeof value === "string") {
    const d = new Date(value);
    if (!isNaN(d.getTime())) return d;
  }

  throw new Error("Neispravan timestamp format.");
}
