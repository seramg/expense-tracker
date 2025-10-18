// utils/regex.ts
export class Regex {
  /** Matches standard email formats like user.name@example.com */
  public static readonly email = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  /** Password: at least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char */
  public static readonly password =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  /** Allow alphabets, spaces, and hyphens for person names */
  public static readonly personName = /^[a-zA-Z\s-]{2,50}$/;

  /** For phone numbers (basic international format) */
  public static readonly phone = /^\+?[0-9]{7,15}$/;
}
