import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import type { Relation } from "typeorm";
import { Location } from "../../locations/entities/location.entity.js";
import { User } from "../../auth/entities/user.entity.js";

@Entity()
export class Employee {
    @PrimaryGeneratedColumn('uuid')
    employeeId: string;

    @Column('text')
    employeeName: string;

    @Column('text')
    employeeLastName: string;

    @Column('text')
    employeePhoneNumber: string;

    @Column('text', {
        unique: true
    })
    employeeEmail: string;

    @Column({
        type: "text",
        nullable: true
    })
    employeePhotoUrl: string;

    @ManyToOne("Location", (location: Location) => location.employees)
    @JoinColumn({name: "locationId"})
    @Column({ type: 'jsonb', nullable: true })
    location: Location;

    @OneToOne(() => User)
    @JoinColumn({name: "userId"})
    user: Relation<User>;
}
