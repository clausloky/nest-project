import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Location } from "../../locations/entities/location.entity.js";
import { User } from "../../auth/entities/user.entity.js";

@Entity()
export class Employee {
    @PrimaryGeneratedColumn('uuid')
    employeeId: string;

    @Column('text')
    providerName: string;

    @Column('text')
    providerLastName: string;

    @Column('text')
    providerPhoneNumber: string;

    @Column('text', {
        unique: true
    })
    providerEmail: string;

    @Column({
        type: "text",
        nullable: true
    })
    providerPhotoUrl: string;

    @ManyToOne("Location", (location: Location) => location.employees)
    @JoinColumn({name: "locationId"})
    location: Location;

    @OneToOne(() => User)
    @JoinColumn({name: "userId"})
    user: User;
}
