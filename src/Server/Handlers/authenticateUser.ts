import { NextFunction , Request , Response } from "express";
import { userAuth } from "../Models/store-users";
import jwt , { Secret } from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

const SecretToken = process.env.TOKEN_SECRET as Secret;

export const authToken = (req:Request , res:Response , next:NextFunction) =>{
    const authorizationHeader = req.headers.authorization;
    if(!authorizationHeader)
    {
        res.status(401).json('Access denied,There is no token');
        return false;
    }

    try {
        const token = authorizationHeader?.split(' ')[1];
        jwt.verify(token, SecretToken);
        next();
    } catch(err) {
        res.status(401).json('Access denied, invalid token');
        return;
    }
}

export const userToken = (user : userAuth[] | null) => {
    return jwt.sign({user} , SecretToken);
}
