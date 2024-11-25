import { UrlEntity } from "src/modules/urls/entities/url.entity";
import { Column, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, Entity, ManyToMany} from "typeorm";

@Entity('users')
export class UserEntity {

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    name:string;

    @Column()
    email:string

    @Column()
    password:string;

    @ManyToMany(() => UrlEntity, (url) => url.user)
    urls: UrlEntity[];

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    createdAt:Date;

    @UpdateDateColumn({ select:false, type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updatedAt:Date;

    @DeleteDateColumn({select:false})
    deletedAt:Date
}