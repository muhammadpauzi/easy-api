import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import BaseModel from './BaseModel';
import { IsUrl, ValidateIf } from 'class-validator';
import User from './User';

@Entity()
export default class UserProfile extends BaseModel {
    @ValidateIf((o) => o.facebook)
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

    @Column()
    userId!: number;

    @OneToOne(() => User, (user) => user.userProfile)
    user!: User;
}
