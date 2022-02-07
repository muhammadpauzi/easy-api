import { BeforeInsert, Column, Entity } from 'typeorm';
import BaseModel from './BaseModel';
import { genSalt, hash } from 'bcrypt';
import {
    IsEmail,
    IsNotEmpty,
    Length,
    Matches,
    Max,
    MaxLength,
} from 'class-validator';
import ValidationHelper from '../helpers/ValidationHelper';
import { VALIDATION_ERROR_MESSAGES } from '../constants/messages';

@Entity({ name: 'users' })
export default class User extends BaseModel {
    @IsNotEmpty()
    @Matches(/[a-zA-Z0-9_-]/, {
        message: ValidationHelper.getValidationMessage(
            VALIDATION_ERROR_MESSAGES.alpha_num_dash,
            'username'
        ),
    })
    @Length(5, 128)
    @Column({ type: 'varchar', length: 128, nullable: false, unique: true })
    username!: string;

    @IsNotEmpty()
    @Length(2, 128)
    @Column({ type: 'varchar', length: 128, nullable: false })
    name!: string;

    @IsNotEmpty()
    @MaxLength(255)
    @IsEmail()
    @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
    email!: string;

    @IsNotEmpty()
    @Length(5, 255)
    @Column({ type: 'varchar', length: 255, nullable: false })
    password!: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    sessionId!: string | null;

    @BeforeInsert()
    public async hashPassword() {
        const salt = await genSalt();
        this.password = await hash(this.password, salt);
    }
}
