using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Edwinschoice.Server.Migrations
{
    /// <inheritdoc />
    public partial class last : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Connections_Items_ItemsId",
                table: "Connections");

            migrationBuilder.DropIndex(
                name: "IX_Connections_ItemsId",
                table: "Connections");

            migrationBuilder.DropColumn(
                name: "ItemsId",
                table: "Connections");

            migrationBuilder.RenameColumn(
                name: "RequiredItem",
                table: "Connections",
                newName: "ItemId");

            migrationBuilder.CreateIndex(
                name: "IX_Connections_ItemId",
                table: "Connections",
                column: "ItemId");

            migrationBuilder.AddForeignKey(
                name: "FK_Connections_Items_ItemId",
                table: "Connections",
                column: "ItemId",
                principalTable: "Items",
                principalColumn: "ItemsId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Connections_Items_ItemId",
                table: "Connections");

            migrationBuilder.DropIndex(
                name: "IX_Connections_ItemId",
                table: "Connections");

            migrationBuilder.RenameColumn(
                name: "ItemId",
                table: "Connections",
                newName: "RequiredItem");

            migrationBuilder.AddColumn<int>(
                name: "ItemsId",
                table: "Connections",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Connections_ItemsId",
                table: "Connections",
                column: "ItemsId");

            migrationBuilder.AddForeignKey(
                name: "FK_Connections_Items_ItemsId",
                table: "Connections",
                column: "ItemsId",
                principalTable: "Items",
                principalColumn: "ItemsId");
        }
    }
}
