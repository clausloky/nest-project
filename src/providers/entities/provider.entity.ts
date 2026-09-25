import { Column, PrimaryGeneratedColumn, Entity, OneToMany } from "typeorm";
import { Product } from "../../products/entities/product.entity.js";

@Entity()
export class Provider {
  @PrimaryGeneratedColumn()
  providerId: string;

  @Column("text")
  providerName: string;

  @Column("text")
  providerEmail: string;

  @Column({
    type: "text",
    nullable: true,
  })
  providerPhoneNumber: string;

  // Relación con productos
  @OneToMany(() => Product, (product) => product.provider
  // , {
  //   eager: true
  // }
  )

  products: Product[];
}
