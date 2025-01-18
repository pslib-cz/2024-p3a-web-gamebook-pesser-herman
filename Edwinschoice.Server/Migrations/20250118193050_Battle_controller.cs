using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Edwinschoice.Server.Migrations
{
    /// <inheritdoc />
    public partial class Battle_controller : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BackroundImage",
                table: "Battles");

            migrationBuilder.AddColumn<string>(
                name: "BattleImagePath",
                table: "Battles",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BattleImagePath",
                table: "Battles");

            migrationBuilder.AddColumn<byte[]>(
                name: "BackroundImage",
                table: "Battles",
                type: "BLOB",
                nullable: false,
                defaultValue: new byte[0]);
        }
    }
}
