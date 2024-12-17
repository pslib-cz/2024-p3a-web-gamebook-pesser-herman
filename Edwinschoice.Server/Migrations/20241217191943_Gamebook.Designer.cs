﻿// <auto-generated />
using Edwinschoice.Server.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace Edwinschoice.Server.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20241217191943_Gamebook")]
    partial class Gamebook
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "9.0.0")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("Edwinschoice.Server.Models.Battles", b =>
                {
                    b.Property<int>("BattlesId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("BattlesId"));

                    b.Property<int>("Attack")
                        .HasColumnType("int");

                    b.Property<byte[]>("BackroundImage")
                        .IsRequired()
                        .HasColumnType("varbinary(max)");

                    b.Property<int>("Defense")
                        .HasColumnType("int");

                    b.Property<string>("EnemyName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("Health")
                        .HasColumnType("int");

                    b.HasKey("BattlesId");

                    b.ToTable("Battles");
                });

            modelBuilder.Entity("Edwinschoice.Server.Models.Connections", b =>
                {
                    b.Property<int>("ConnectionsId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("ConnectionsId"));

                    b.Property<int?>("BattlesId")
                        .HasColumnType("int");

                    b.Property<int>("FromId")
                        .HasColumnType("int");

                    b.Property<int?>("LocationId")
                        .HasColumnType("int");

                    b.Property<int>("ToId")
                        .HasColumnType("int");

                    b.HasKey("ConnectionsId");

                    b.HasIndex("BattlesId");

                    b.HasIndex("LocationId");

                    b.ToTable("Connections");
                });

            modelBuilder.Entity("Edwinschoice.Server.Models.Endings", b =>
                {
                    b.Property<int>("EndingsId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("EndingsId"));

                    b.Property<string>("EndingDescription")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<byte[]>("EndingImage")
                        .IsRequired()
                        .HasColumnType("varbinary(max)");

                    b.Property<string>("EndingName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("EndingsId");

                    b.ToTable("Endings");
                });

            modelBuilder.Entity("Edwinschoice.Server.Models.Items", b =>
                {
                    b.Property<int>("ItemsId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("ItemsId"));

                    b.Property<int?>("Attack")
                        .HasColumnType("int");

                    b.Property<int?>("Defense")
                        .HasColumnType("int");

                    b.Property<int?>("Health")
                        .HasColumnType("int");

                    b.Property<byte[]>("ItemImage")
                        .IsRequired()
                        .HasColumnType("varbinary(max)");

                    b.Property<string>("ItemName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("forStory")
                        .HasColumnType("bit");

                    b.Property<bool>("isConsumable")
                        .HasColumnType("bit");

                    b.HasKey("ItemsId");

                    b.ToTable("Items");
                });

            modelBuilder.Entity("Edwinschoice.Server.Models.Locations", b =>
                {
                    b.Property<int>("LocationsId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("LocationsId"));

                    b.Property<int?>("ItemId")
                        .HasColumnType("int");

                    b.Property<bool?>("ItemReobtainable")
                        .HasColumnType("bit");

                    b.Property<string>("LocationDescription")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<byte[]>("LocationImage")
                        .IsRequired()
                        .HasColumnType("varbinary(max)");

                    b.Property<string>("LocationName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("LocationsId");

                    b.HasIndex("ItemId");

                    b.ToTable("Locations");
                });

            modelBuilder.Entity("Edwinschoice.Server.Models.Connections", b =>
                {
                    b.HasOne("Edwinschoice.Server.Models.Battles", "Battle")
                        .WithMany()
                        .HasForeignKey("BattlesId");

                    b.HasOne("Edwinschoice.Server.Models.Locations", "Location")
                        .WithMany()
                        .HasForeignKey("LocationId");

                    b.Navigation("Battle");

                    b.Navigation("Location");
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
