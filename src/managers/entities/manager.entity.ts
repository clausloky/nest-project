import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import type { Relation } from "typeorm";
import type { Location } from "../../locations/entities/location.entity.js";
import { User } from "../../auth/entities/user.entity.js";

@Entity()
export class Manager {
  @PrimaryGeneratedColumn('uuid')
  managerId: string;

  @Column('text')
  managerFullName: string;

  @Column('float')
  managerSalary: number;

  @Column('text', {
        unique: true
    })
  managerEmail: string;

  @Column('text')
  managerPhoneNumber: string;

  @OneToOne("Location", (location: Location) => location.manager, 
  {
    nullable: true
  })
  @JoinColumn({
    name: "locationId"
  })
  location: Location | null;

  @OneToOne(() => User)
  @JoinColumn({name: "userId"})
  user: Relation<User>;
}
