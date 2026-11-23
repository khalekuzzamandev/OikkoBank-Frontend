import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
const MONGODB_URL = process.env.MONGODB_URL;

if (!MONGODB_URL) {
  throw new Error("MONGODB_URL is missing in environment variables");
}

const client = new MongoClient(MONGODB_URL);
const db = client.db("oikko-bank");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),

  emailAndPassword: {
    enabled: true,
  },

  user: {
    additionalFields: {
      // extra filed
      role:{type:"string",defaultValue:"customer"},
      isBlocked:{type:"boolean",defaultValue:false},
      status:{type:"string",defaultValue:"pending"},
      isverified:{type:"boolean",defaultValue:false},

      fatherName: { type: "string", required: true },
      motherName: { type: "string", required: true },
      dob: { type: "string", required: true },
      gender: { type: "string", required: true },
      maritalStatus: { type: "string", required: true },
      nid: { type: "string", required: true },
      occupation: { type: "string", required: true },
      religion: { type: "string", required: true },
      phone: { type: "string", required: true },
      altPhone: { type: "string", required: true },
      division: { type: "string", required: true },
      district: { type: "string", required: true },
      thana: { type: "string", required: true },
      postOffice: { type: "string", required: true },
      postCode: { type: "string", required: true },
      village: { type: "string", required: true },
      address: { type: "string", required: true },
      accountType: { type: "string", required: true },
      nomineeName: { type: "string", required: true },
      nomineeRelation: { type: "string", required: true },
      nomineePhone: { type: "string", required: true },
      nomineeNid: { type: "string", required: true },
    },
  },
});