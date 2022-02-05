import { BeforeInsert, Column, Entity } from "typeorm";
import BaseModel from "./BaseModel";
import { genSalt, hash } from 'bcrypt';

@Entity({ name: 'users' })
export default class User extends BaseModel {
    @Column({ type: "varchar", length: 128, nullable: false, unique: true })
    username!: string;

    @Column({ type: "varchar", length: 128, nullable: false })
    name!: string;

    @Column({ type: "varchar", length: 255, nullable: false, unique: true })
    email!: string;

    @Column({ type: "varchar", length: 255, nullable: false })
    password!: string;

    @Column({ type: "varchar", length: 20, nullable: true })
    sessionId!: string;

    @BeforeInsert()
    public async hashPassword() {
        const salt = await genSalt();
        this.password = await hash(this.password, salt);
    }
}