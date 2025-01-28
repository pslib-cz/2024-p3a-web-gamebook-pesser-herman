using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Edwinschoice.Server.Migrations
{
    /// <inheritdoc />
    public partial class EnemyFix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Health",
                table: "Battles",
                newName: "EnemyHealth");

            migrationBuilder.RenameColumn(
                name: "Defense",
                table: "Battles",
                newName: "EnemyDefense");

            migrationBuilder.RenameColumn(
                name: "Attack",
                table: "Battles",
                newName: "EnemyAttack");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "EnemyHealth",
                table: "Battles",
                newName: "Health");

            migrationBuilder.RenameColumn(
                name: "EnemyDefense",
                table: "Battles",
                newName: "Defense");

            migrationBuilder.RenameColumn(
                name: "EnemyAttack",
                table: "Battles",
                newName: "Attack");

            migrationBuilder.AlterColumn<string>(
                name: "ConnectionText",
                table: "Connections",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "TEXT");
        }
    }
}
