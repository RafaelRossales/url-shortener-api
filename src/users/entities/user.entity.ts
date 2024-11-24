import { Column, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, Entity} from "typeorm";

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

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    createdAt:Date;

    @UpdateDateColumn({ select:false, type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updatedAt:Date;

    @DeleteDateColumn({select:false})
    deletedAt:Date
}
