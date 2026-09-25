import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Manager {
  @PrimaryGeneratedColumn('uuid')
  managerId: string;

  @Column('text')
  managerFullName: string;

  @Column('float')
  managerSalary: number;

  @Column('text')
  managerEmail: string;

  @Column('text')
  managerPhoneNumber: string;

  // Relación con Location (se puede agregar con @ManyToOne o @OneToMany según el diseño)
}
