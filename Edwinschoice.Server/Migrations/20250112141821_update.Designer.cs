﻿// <auto-generated />
using Edwinschoice.Server.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace Edwinschoice.Server.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20250112141821_update")]
    partial class update
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder.HasAnnotation("ProductVersion", "9.0.0");

            modelBuilder.Entity("Edwinschoice.Server.Models.Battles", b =>
                {
                    b.Property<int>("BattlesId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int>("Attack")
                        .HasColumnType("INTEGER");

                    b.Property<byte[]>("BackroundImage")
                        .IsRequired()
                        .HasColumnType("BLOB");

                    b.Property<int>("Defense")
                        .HasColumnType("INTEGER");

                    b.Property<string>("EnemyName")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<int>("Health")
                        .HasColumnType("INTEGER");

                    b.HasKey("BattlesId");

                    b.ToTable("Battles");
                });

            modelBuilder.Entity("Edwinschoice.Server.Models.Connections", b =>
                {
                    b.Property<int>("ConnectionsId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int?>("BattlesId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("ConnectionText")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<int>("FromId")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("LocationsId")
                        .HasColumnType("INTEGER");

                    b.Property<int>("ToId")
                        .HasColumnType("INTEGER");

                    b.HasKey("ConnectionsId");

                    b.HasIndex("BattlesId");

                    b.HasIndex("FromId");

                    b.HasIndex("LocationsId");

                    b.HasIndex("ToId");

                    b.ToTable("Connections");
                });

            modelBuilder.Entity("Edwinschoice.Server.Models.Endings", b =>
                {
                    b.Property<int>("EndingsId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("EndingDescription")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<byte[]>("EndingImage")
                        .IsRequired()
                        .HasColumnType("BLOB");

                    b.Property<string>("EndingName")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("EndingsId");

                    b.ToTable("Endings");
                });

            modelBuilder.Entity("Edwinschoice.Server.Models.Items", b =>
                {
                    b.Property<int>("ItemsId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int?>("Attack")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("Defense")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("Health")
                        .HasColumnType("INTEGER");

                    b.Property<byte[]>("ItemImage")
                        .IsRequired()
                        .HasColumnType("BLOB");

                    b.Property<string>("ItemName")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<bool>("forStory")
                        .HasColumnType("INTEGER");

                    b.Property<bool>("isConsumable")
                        .HasColumnType("INTEGER");

                    b.HasKey("ItemsId");

                    b.ToTable("Items");
                });

            modelBuilder.Entity("Edwinschoice.Server.Models.Locations", b =>
                {
                    b.Property<int>("LocationsId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int?>("ItemId")
                        .HasColumnType("INTEGER");

                    b.Property<bool?>("ItemReobtainable")
                        .HasColumnType("INTEGER");

                    b.Property<string>("LocationDescription")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("LocationImagePath")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("LocationName")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("LocationsId");

                    b.HasIndex("ItemId");

                    b.ToTable("Locations");
                });

            modelBuilder.Entity("Edwinschoice.Server.Models.Connections", b =>
                {
                    b.HasOne("Edwinschoice.Server.Models.Battles", "Battle")
                        .WithMany()
                        .HasForeignKey("BattlesId");

                    b.HasOne("Edwinschoice.Server.Models.Locations", "From")
                        .WithMany()
                        .HasForeignKey("FromId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Edwinschoice.Server.Models.Locations", "Locations")
                        .WithMany()
                        .HasForeignKey("LocationsId");

                    b.HasOne("Edwinschoice.Server.Models.Locations", "To")
                        .WithMany()
                        .HasForeignKey("ToId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Battle");

                    b.Navigation("From");

                    b.Navigation("Locations");

                    b.Navigation("To");
                });

            modelBuilder.Entity("Edwinschoice.Server.Models.Locations", b =>
                {
                    b.HasOne("Edwinschoice.Server.Models.Items", "Item")
                        .WithMany()
                        .HasForeignKey("ItemId");

                    b.Navigation("Item");
                });
#pragma warning restore 612, 618
        }
    }
}
