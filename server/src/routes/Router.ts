import { Router } from "express";

export default interface RouterType {
    build(): Router;
}