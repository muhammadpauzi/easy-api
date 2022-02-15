import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import BaseModel from './BaseModel';
import { IsUrl, ValidateIf } from 'class-validator';
import User from './User';

@Entity({ name: 'user_profiles' })
export default class UserProfile extends BaseModel {
    @ValidateIf((o) => o.facebook) // validate this field if the request field/data is not empty
    @IsUrl()
    @Column({ type: 'varchar', length: 1024, nullable: true })
    facebook!: string;

    @ValidateIf((o) => o.instagram)
    @IsUrl()
    @Column({ type: 'varchar', length: 1024, nullable: true })
    instagram!: string;

    @ValidateIf((o) => o.github)
    @IsUrl()
    @Column({ type: 'varchar', length: 1024, nullable: true })
    github!: string;

    @ValidateIf((o) => o.twitter)
    @IsUrl()
    @Column({ type: 'varchar', length: 1024, nullable: true })
    twitter!: string;

    @Column({ type: 'text', nullable: true })
    bio!: string;

    @OneToOne(() => User, (user) => user.userProfile)
    user!: User;
}
