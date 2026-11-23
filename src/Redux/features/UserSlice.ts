import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type User = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  createdAt?: string;
  updatedAt?: string;
  role?: string;
  isBlocked?: boolean;
  status?: string;
  isverified?: boolean;
  fatherName?: string;
  motherName?: string;
  dob?: string;
  gender?: string;
  maritalStatus?: string;
  nid?: string;
  occupation?: string;
  religion?: string;
  phone?: string;
  altPhone?: string;
  division?: string;
  district?: string;
  thana?: string;
  postOffice?: string;
  postCode?: string;
  village?: string;
  address?: string;
  accountType?: string;
  nomineeName?: string;
  nomineeRelation?: string;
  nomineePhone?: string;
  nomineeNid?: string;
};

type UserInput = Omit<User, "createdAt" | "updatedAt"> & {
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

const serializeDate = (value: string | Date | undefined) =>
  value instanceof Date ? value.toISOString() : value;

const userSlice = createSlice({
  name: "user",
  initialState: null as User | null,
  reducers: {
    setUser: {
      reducer: (_state, action: PayloadAction<User>) => action.payload,
      prepare: (user: UserInput) => ({
        payload: {
          ...user,
          createdAt: serializeDate(user.createdAt),
          updatedAt: serializeDate(user.updatedAt),
        },
      }),
    },
    clearUser: () => null,
  },
});

export const { setUser, clearUser } = userSlice.actions;
export const selectUser = (state: { user: User | null }) => state.user;
export default userSlice.reducer;