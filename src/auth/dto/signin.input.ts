import { INVALID_CREDENTIAL } from "@/constants/error";
import { IsString } from "class-validator";

export class SigninInput {
    @IsString({ message: INVALID_CREDENTIAL })
    username: string;
}
