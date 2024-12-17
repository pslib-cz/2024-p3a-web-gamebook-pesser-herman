using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Edwinschoice.Server.Migrations
{
    /// <inheritdoc />
    public partial class Gamebook : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Battles",
                columns: table => new
                {
                    BattlesId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EnemyName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Health = table.Column<int>(type: "int", nullable: false),
                    Defense = table.Column<int>(type: "int", nullable: false),
                    Attack = table.Column<int>(type: "int", nullable: false),
                    BackroundImage = table.Column<byte[]>(type: "varbinary(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Battles", x => x.BattlesId);
                });

            migrationBuilder.CreateTable(
                name: "Endings",
                columns: table => new
                {
                    EndingsId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EndingName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EndingDescription = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EndingImage = table.Column<byte[]>(type: "varbinary(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Endings", x => x.EndingsId);
                });

            migrationBuilder.CreateTable(
                name: "Items",
                columns: table => new
                {
                    ItemsId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ItemName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Health = table.Column<int>(type: "int", nullable: true),
                    Attack = table.Column<int>(type: "int", nullable: true),
                    Defense = table.Column<int>(type: "int", nullable: true),
                    isConsumable = table.Column<bool>(type: "bit", nullable: false),
                    forStory = table.Column<bool>(type: "bit", nullable: false),
                    ItemImage = table.Column<byte[]>(type: "varbinary(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Items", x => x.ItemsId);
                });

            migrationBuilder.CreateTable(
                name: "Locations",
                columns: table => new
                {
                    LocationsId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    LocationName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LocationDescription = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LocationImage = table.Column<byte[]>(type: "varbinary(max)", nullable: false),
                    ItemReobtainable = table.Column<bool>(type: "bit", nullable: true),
                    ItemId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Locations", x => x.LocationsId);
                    table.ForeignKey(
                        name: "FK_Locations_Items_ItemId",
                        column: x => x.ItemId,
                        principalTable: "Items",
                        principalColumn: "ItemsId");
                });

            migrationBuilder.CreateTable(
                name: "Connections",
                columns: table => new
                {
                    ConnectionsId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FromId = table.Column<int>(type: "int", nullable: false),
                    ToId = table.Column<int>(type: "int", nullable: false),
                    LocationId = table.Column<int>(type: "int", nullable: true),
                    BattlesId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Connections", x => x.ConnectionsId);
                    table.ForeignKey(
                        name: "FK_Connections_Battles_BattlesId",
                        column: x => x.BattlesId,
                        principalTable: "Battles",
                        principalColumn: "BattlesId");
                    table.ForeignKey(
                        name: "FK_Connections_Locations_LocationId",
                        column: x => x.LocationId,
                        principalTable: "Locations",
                        principalColumn: "LocationsId");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Connections_BattlesId",
                table: "Connections",
                column: "BattlesId");

            migrationBuilder.CreateIndex(
                name: "IX_Connections_LocationId",
                table: "Connections",
                column: "LocationId");

            migrationBuilder.CreateIndex(
                name: "IX_Locations_ItemId",
                table: "Locations",
                column: "ItemId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Connections");

            migrationBuilder.DropTable(
                name: "Endings");

            migrationBuilder.DropTable(
                name: "Battles");

            migrationBuilder.DropTable(
                name: "Locations");

            migrationBuilder.DropTable(
                name: "Items");
        }
    }
}
