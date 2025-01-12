using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Edwinschoice.Server.Migrations
{
    /// <inheritdoc />
    public partial class update : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LocationImage",
                table: "Locations");

            migrationBuilder.AddColumn<string>(
                name: "LocationImagePath",
                table: "Locations",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ConnectionText",
                table: "Connections",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LocationImagePath",
                table: "Locations");

            migrationBuilder.DropColumn(
                name: "ConnectionText",
                table: "Connections");

            migrationBuilder.AddColumn<byte[]>(
                name: "LocationImage",
                table: "Locations",
                type: "BLOB",
                nullable: false,
                defaultValue: new byte[0]);
        }
    }
}
