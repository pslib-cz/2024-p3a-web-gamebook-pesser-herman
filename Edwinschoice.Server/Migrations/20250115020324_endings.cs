using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Edwinschoice.Server.Migrations
{
    /// <inheritdoc />
    public partial class endings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EndingImage",
                table: "Endings");

            migrationBuilder.AddColumn<string>(
                name: "EndingImagePath",
                table: "Endings",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "LocationsId",
                table: "Endings",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<string>(
                name: "ConnectionText",
                table: "Connections",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "TEXT");

            migrationBuilder.CreateIndex(
                name: "IX_Endings_LocationsId",
                table: "Endings",
                column: "LocationsId");

            migrationBuilder.AddForeignKey(
                name: "FK_Endings_Locations_LocationsId",
                table: "Endings",
                column: "LocationsId",
                principalTable: "Locations",
                principalColumn: "LocationsId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Endings_Locations_LocationsId",
                table: "Endings");

            migrationBuilder.DropIndex(
                name: "IX_Endings_LocationsId",
                table: "Endings");

            migrationBuilder.DropColumn(
                name: "EndingImagePath",
                table: "Endings");

            migrationBuilder.DropColumn(
                name: "LocationsId",
                table: "Endings");

            migrationBuilder.AddColumn<byte[]>(
                name: "EndingImage",
                table: "Endings",
                type: "BLOB",
                nullable: false,
                defaultValue: new byte[0]);

            migrationBuilder.AlterColumn<string>(
                name: "ConnectionText",
                table: "Connections",
                type: "TEXT",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldNullable: true);
        }
    }
}
