import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type User = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
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

const userSlice = createSlice({
  name: "user",
  initialState: null as User | null,
  reducers: {
    setUser: (_state, action: PayloadAction<User>) => action.payload,
    clearUser: () => null,
  },
});

export const { setUser, clearUser } = userSlice.actions;
export const selectUser = (state: { user: User | null }) => state.user;
export default userSlice.reducer;