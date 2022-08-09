import { Request, Response } from "express";
import { sqlConfig } from "../Config/Config";
import mssql from "mssql";
import { v4 as uid } from "uuid";
import bcrypt from "bcrypt";
import { UserSchema, UserSchema2 } from "../Helper/UserValidator";
import {User} from '../Interfaces/interfaces'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

import {Data} from '../Interfaces/interfaces'
interface Extended extends Request{
    info?:Data
}

interface ExtendedRequest extends Request {
  body: {
    email: string;
    password: string;
    name:string
  };
}
export const registerUser = async (req: ExtendedRequest, res: Response) => {
  try {
    const pool = await mssql.connect(sqlConfig);
    const id = uid();
    const { email, password,name } = req.body;
    const { error, value } = UserSchema.validate(req.body);
    if (error) {
      return res.json({ error: error.details[0].message });
    }
    const hashedpassword = await bcrypt.hash(password, 10);

    await pool
      .request()
      .input("id", mssql.VarChar, id)
      .input("email", mssql.VarChar, email)
      .input("password", mssql.VarChar, hashedpassword)
      .input("name", mssql.VarChar, name)
      .execute("insertSingleUser");

      

    res.json({ message: "Registered Successfully" });
  } catch (error: any) {
    res.json({ error });
  }
};
export const loginUser = async (req: ExtendedRequest, res: Response) => {
  try {
    const pool = await mssql.connect(sqlConfig);
    const { email, password } = req.body;
    const { error, value } = UserSchema2.validate(req.body);

    if (error) {
      return res.json({ error: error.details[0].message });
    }
    const user:User[] = await (await pool
      .request()
      .input("email", mssql.VarChar, email)
      .execute("getSingleUser")).recordset

      
      if (!user) {
        res.json({message:"User Not Found!"})
        
      }
      const validPassword=await bcrypt.compare(password,user[0].password)
      if (!validPassword) {
        return res.json({message:"Invalid Password!"})
        
      }
      const payload=user.map(item=>{
        const{password,...rest}=item
        return rest


      })
      const token=jwt.sign(payload[0],process.env.KEY as string,{expiresIn:'3600s'})
    res.json({ message:"Logged in",token});
    
  } catch (error: any) {
    res.json({ error });
    
  }
};

export const getHomepage=async (req:Extended,res:Response)=>{
    if (req.info) {
        res.json({message:`Dear ${req.info.email} Welcome to the homepage!!`})
        
    }
    
}
export const checkUser= async (req:Extended, res:Response)=>{
  if(req.info){
    res.json({name:req.info.name, role:req.info.role})
  }
}
