import { type Request, type Response, type NextFunction } from "express";
import jwt from 'jsonwebtoken';
import type { JwtUserPayload } from "../types/auth.js";

export const autenticado =(
    req: Request,
    res:Response,
    next: NextFunction
)=>{
    try{
        const authHead=req.headers.authorization;
        if(!authHead?.startsWith("Bearer ")){
            return res.status(401).json({message: 'Token requerido desgraciad@ xd'})
        }
        const token=authHead.split(" ")[1];

        if(!token){return res.status(401).json({message:'Token requerido mmhuevo'})}

        const tSecret=process.env.JWT_SECRET;
        if(!tSecret) {return res.status(500).json({message: "Configure bien el servido, no sea imbecíl"})}

        const decod=jwt.verify(token, tSecret);

        if(typeof decod === "string") {return res.status(401).json({message: "tu token esta pocho"})}


        const payload=decod as JwtUserPayload;

        if(!payload.userId || !payload.email){ return res.status(401).json({message: "token pocho x2"})}

        req.user=payload;
        next();
    }catch{
        return res.status(401).json({message: "token pocho x3"})
    }
}