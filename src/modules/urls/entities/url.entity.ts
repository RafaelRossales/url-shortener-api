import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { UserEntity } from 'src/modules/users/entities/user.entity';


@Entity('urls')
export class UrlEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    originalUrl: string;
  
    @Column({ unique: true })
    shortUrl: string;

    @Column()
    userId:string
  
    @ManyToOne(() => UserEntity, (user) => user.urls, { nullable: true })
    user: UserEntity;
  
    @Column({ default: 0 })
    clicks: number;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    @DeleteDateColumn()
    deletedAt: Date | null;

}
